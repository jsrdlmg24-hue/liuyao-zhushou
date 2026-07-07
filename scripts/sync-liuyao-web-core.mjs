import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')
const targetSrc = path.join(repoRoot, 'src')
const localSourceSrc = process.env.LIUYAO_WEB_SRC
  ? path.resolve(process.env.LIUYAO_WEB_SRC)
  : path.resolve(repoRoot, '..', 'liuyao-web', 'src')

const githubRawBase = 'https://raw.githubusercontent.com/jsrdlmg24-hue/liuyao-web/main/src'

const files = [
  'types.ts',
  'data/bazi.ts',
  'data/naja.ts',
  'data/hexagrams.ts',
  'data/jieqi.ts',
  'data/deities.ts',
  'engine/coinCasting.ts',
  'engine/liuqin.ts',
  'engine/shiying.ts',
  'engine/fushen.ts',
  'engine/paipanCore.ts',
  'engine/bazi.ts',
  'engine/kongwang.ts',
  'engine/liushen.ts',
  'engine/shensha.ts',
  'engine/changsheng.ts',
  'engine/timeContext.ts',
  'engine/plateViewModel.ts'
]

async function exists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function readSource(relPath) {
  const localPath = path.join(localSourceSrc, relPath)
  if (await exists(localPath)) {
    return await fs.readFile(localPath, 'utf8')
  }

  const url = `${githubRawBase}/${relPath.replaceAll(path.sep, '/')}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Cannot fetch ${url}: ${response.status} ${response.statusText}`)
  }
  return await response.text()
}

async function main() {
  const copied = []
  await fs.mkdir(targetSrc, { recursive: true })

  for (const relPath of files) {
    const content = await readSource(relPath)
    const targetPath = path.join(targetSrc, relPath)
    await fs.mkdir(path.dirname(targetPath), { recursive: true })
    await fs.writeFile(targetPath, content, 'utf8')
    copied.push(relPath)
  }

  const source = (await exists(localSourceSrc)) ? localSourceSrc : 'GitHub raw fallback'
  console.log(`[sync-core] copied ${copied.length} liuyao-web core files into ${path.relative(repoRoot, targetSrc)}`)
  console.log(`[sync-core] source: ${source}`)
}

main().catch(err => {
  console.error('[sync-core] failed')
  console.error(err)
  process.exit(1)
})
