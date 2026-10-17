// Sends one snapshot of every published release's download counters to PostHog.
//
// GitHub keeps only cumulative counts, with no dates, so a scheduled workflow
// records them every 12 hours and PostHog derives the daily change.
//
// `downloads` counts every Mac download of a release. After 1.12.0 a release
// ships one file, Nori-arm64.dmg, which both meetnori.app/download (through
// the latest-release URL) and the Sparkle appcast point to, so website
// downloads and in-app updates can no longer be told apart.
//
// Releases from 1.12.0 on also carry the Windows and Linux installers, counted
// apart: windows_downloads (setup .exe) and linux_downloads, the sum of
// linux_deb_downloads, linux_rpm_downloads and linux_appimage_downloads. The
// site and the desktop updater feed point to the same files, so these too mix
// first installs and updates.
//
// Releases up to 1.12.0 still have the versioned zip the appcast pointed to,
// and keep reporting the split they always did:
//   - site_downloads: Nori-arm64.zip, the website download before it moved to
//     the disk image;
//   - update_downloads: Nori-<version>-arm64.zip, in-app updates.
// Only aggregate public counters leave GitHub: no person, IP, or device data.

const repository = process.env.GITHUB_REPOSITORY
const githubToken = process.env.GITHUB_TOKEN
const projectToken = process.env.POSTHOG_PROJECT_TOKEN
const posthogHost = 'https://eu.i.posthog.com'

if (!repository || !githubToken) throw new Error('GITHUB_REPOSITORY and GITHUB_TOKEN are required.')
if (!projectToken) throw new Error('Set the POSTHOG_PROJECT_TOKEN repository variable to the Nori PostHog project token.')

const releases = []
for (let page = 1; ; page += 1) {
  const response = await fetch(`https://api.github.com/repos/${repository}/releases?per_page=100&page=${page}`, {
    headers: { accept: 'application/vnd.github+json', authorization: `Bearer ${githubToken}`, 'x-github-api-version': '2022-11-28' },
  })
  if (!response.ok) throw new Error(`GitHub releases request failed with ${response.status}.`)
  const batch = await response.json()
  releases.push(...batch)
  if (batch.length < 100) break
}

const published = releases
  .filter((release) => !release.draft && release.published_at)
  .sort((left, right) => right.published_at.localeCompare(left.published_at))

const snapshotAt = new Date().toISOString()
const count = (release, matches) => release.assets
  .filter((asset) => matches(asset.name))
  .reduce((total, asset) => total + asset.download_count, 0)

// Checksums are not downloads of the app.
const isMacDownload = (name) => /^Nori-(?:\d+(?:\.\d+)*-)?arm64\.(?:zip|dmg)$/.test(name)
const isVersionedZip = (name) => /^Nori-\d+(?:\.\d+)*-arm64\.zip$/.test(name)
const isWindowsInstaller = (name) => /^Nori_\d+(?:\.\d+)*_\w+-setup\.exe$/.test(name)
const isDebPackage = (name) => /^Nori_\d+(?:\.\d+)*_\w+\.deb$/.test(name)
const isRpmPackage = (name) => /^Nori-\d+(?:\.\d+)*-\d+\.\w+\.rpm$/.test(name)
const isAppImage = (name) => /^Nori_\d+(?:\.\d+)*_\w+\.AppImage$/.test(name)
const isDesktopInstaller = (name) => [isWindowsInstaller, isDebPackage, isRpmPackage, isAppImage].some((matches) => matches(name))

const batch = published.map((release, index) => ({
  event: 'github_release_downloads',
  timestamp: snapshotAt,
  properties: {
    distinct_id: 'nori-github-release-stats',
    $process_person_profile: false,
    release_tag: release.tag_name,
    release_published_at: release.published_at,
    // 1 is the latest release.
    release_rank: index + 1,
    prerelease: release.prerelease,
    downloads: count(release, isMacDownload),
    ...(release.assets.some((asset) => isVersionedZip(asset.name)) && {
      site_downloads: count(release, (name) => name === 'Nori-arm64.zip'),
      update_downloads: count(release, isVersionedZip),
    }),
    ...(release.assets.some((asset) => isDesktopInstaller(asset.name)) && {
      windows_downloads: count(release, isWindowsInstaller),
      linux_downloads: count(release, (name) => isDebPackage(name) || isRpmPackage(name) || isAppImage(name)),
      linux_deb_downloads: count(release, isDebPackage),
      linux_rpm_downloads: count(release, isRpmPackage),
      linux_appimage_downloads: count(release, isAppImage),
    }),
  },
}))

const response = await fetch(`${posthogHost}/batch/`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ api_key: projectToken, batch }),
})
if (!response.ok) throw new Error(`PostHog batch request failed with ${response.status}.`)

const total = (key) => batch.reduce((sum, { properties }) => sum + (properties[key] ?? 0), 0)
console.log(`Reported ${batch.length} releases at ${snapshotAt}: ${total('downloads')} Mac, ${total('windows_downloads')} Windows, ${total('linux_downloads')} Linux downloads.`)
