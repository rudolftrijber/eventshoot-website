export type VideoEmbed =
  | { kind: 'vimeo'; src: string }
  | { kind: 'iframe'; src: string }
  | { kind: 'script'; src: string }
  | { kind: 'link'; href: string }

export interface KlantVideo {
  title: string
  url: string
  type?: 'vimeo' | 'iframe' | 'script' | 'link'
}

function bbvmsIframeSrc(url: string): string {
  const htmlUrl = url.replace(/\.js(\?.*)?$/, '.html$1')
  if (htmlUrl.includes('inheritDimensions')) return htmlUrl
  return `${htmlUrl}${htmlUrl.includes('?') ? '&' : '?'}inheritDimensions=true`
}

export function getVideoEmbed(video: KlantVideo): VideoEmbed {
  const type = video.type ?? inferVideoType(video.url)

  if (type === 'iframe') {
    const src = video.url.includes('bbvms.com') && video.url.endsWith('.js')
      ? bbvmsIframeSrc(video.url)
      : video.url
    return { kind: 'iframe', src }
  }

  if (type === 'script') {
    return { kind: 'script', src: video.url }
  }

  if (type === 'link') {
    return { kind: 'link', href: video.url }
  }

  const vimeo = video.url.match(/vimeo\.com\/(\d+)(?:\/([a-f0-9]+))?/)
  if (vimeo) {
    const hash = vimeo[2] ? `?h=${vimeo[2]}&` : '?'
    return {
      kind: 'vimeo',
      src: `https://player.vimeo.com/video/${vimeo[1]}${hash}title=0&byline=0&portrait=0`,
    }
  }

  return { kind: 'link', href: video.url }
}

function inferVideoType(url: string): KlantVideo['type'] {
  if (url.includes('player.vimeo.com') || url.includes('vimeo.com/')) return 'vimeo'
  if (url.includes('bbvms.com') && url.endsWith('.js')) return 'iframe'
  if (url.includes('bluebillywig') || url.includes('bbvms.com') || url.includes('/embed/')) return 'iframe'
  return 'link'
}
