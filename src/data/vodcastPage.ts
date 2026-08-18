/**
 * Config en asset-paden voor /diensten/event-vodcast-recording
 *
 * Foto's: /public/DATA_EVENTSHOOT/SITE_IMAGES/VODCAST/ is leidend.
 * Lijst wordt gegenereerd via scripts/generate-vodcast-photos.mjs.
 * Hoofdvideo: Vimeo 1218955382. Engels: zelfde video met texttrack=en.
 */

/** Zet op true om de investeringsstrook publiek te tonen. Rolf beslist nog. */
export const SHOW_VODCAST_INVESTMENT = false

export const VODCAST_PATH_NL = '/diensten/event-vodcast-recording'
export const VODCAST_PATH_EN = '/en/diensten/event-vodcast-recording'

export function vodcastPath(locale: string) {
  return locale.startsWith('en') ? VODCAST_PATH_EN : VODCAST_PATH_NL
}

export const VODCAST_ONEPAGER_NL = '/downloads/eventshoot-event-vodcast-recording.pdf'
export const VODCAST_ONEPAGER_EN = '/DATA_EVENTSHOOT/FILES/Event_Vodcast_Recording_ENG.pdf'

const VIMEO_BASE =
  'https://player.vimeo.com/video/1218955382?title=0&byline=0&portrait=0'

export const VODCAST_INTRO_VIMEO = VIMEO_BASE
export const VODCAST_INTRO_VIMEO_EN = `${VIMEO_BASE}&texttrack=en`

export {
  VODCAST_GALLERY,
  VODCAST_HERO,
  VODCAST_LONGFORM,
  VODCAST_SHORTFORM,
} from './vodcastPhotos.generated'
