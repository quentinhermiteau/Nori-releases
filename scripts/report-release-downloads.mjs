// Sends one snapshot of every published release's download counters to PostHog.
//
// GitHub keeps only cumulative counts, with no dates, so a scheduled workflow
// records them every hour and PostHog derives the daily change. Each release
// has two archives that count different things:
//   - Nori-arm64.zip is what meetnori.app/download fetches through the
//     latest-release URL, so its count is downloads from the website while that
//     release was the latest one;
//   - Nori-<version>-arm64.zip is what the Sparkle appcast points to, so its
//     count is in-app updates to that version.
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
    site_downloads: count(release, (name) => name === 'Nori-arm64.zip'),
    update_downloads: count(release, (name) => /^Nori-\d+(?:\.\d+)*-arm64\.zip$/.test(name)),
  },
}))

const response = await fetch(`${posthogHost}/batch/`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ api_key: projectToken, batch }),
})
if (!response.ok) throw new Error(`PostHog batch request failed with ${response.status}.`)

const totals = batch.reduce((sum, { properties }) => ({
  site: sum.site + properties.site_downloads,
  updates: sum.updates + properties.update_downloads,
}), { site: 0, updates: 0 })
console.log(`Reported ${batch.length} releases at ${snapshotAt}: ${totals.site} website downloads, ${totals.updates} in-app updates.`)
