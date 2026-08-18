/**
 * Config en asset-paden voor /diensten/event-vodcast-recording
 *
 * Foto's: /public/DATA_EVENTSHOOT/SITE_IMAGES/VODCAST/ is leidend.
 * Lijst wordt gegenereerd via scripts/generate-vodcast-photos.mjs.
 * Hoofdvideo NL: Vimeo 1218955382. Engels: 1219333277 (met Engelse ondertiteling).
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

export const VODCAST_INTRO_VIMEO =
  'https://player.vimeo.com/video/1218955382?title=0&byline=0&portrait=0'
export const VODCAST_INTRO_VIMEO_EN =
  'https://player.vimeo.com/video/1219333277?title=0&byline=0&portrait=0'

export {
  VODCAST_GALLERY,
  VODCAST_HERO,
  VODCAST_LONGFORM,
  VODCAST_SHORTFORM,
} from './vodcastPhotos.generated'
