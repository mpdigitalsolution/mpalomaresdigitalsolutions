/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Analytics script URL. Unset = no analytics loads, whatever the visitor chose. */
  readonly VITE_ANALYTICS_SRC?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '@phosphor-icons/react' {
  import type { ComponentType, SVGProps } from 'react'
  export type IconWeight = 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone'
  export interface IconProps extends SVGProps<SVGSVGElement> {
    color?: string
    size?: string | number
    weight?: IconWeight
    mirrored?: boolean
    alt?: string
  }
  export type Icon = ComponentType<IconProps>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const IconContext: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const IconBase: any

  export const Briefcase: Icon
  export const Compass: Icon
  export const Cube: Icon
  export const Envelope: Icon
  export const FileText: Icon
  export const House: Icon
  export const SealCheck: Icon
  export const ShieldCheck: Icon
  export const Stack: Icon
  export const User: Icon
  export const XLogo: Icon
  export const X: Icon
  export const PaperPlaneTilt: Icon
  export const WarningCircle: Icon
  export const Trophy: Icon
  export const VideoCamera: Icon
  export const XCircle: Icon
  export const Play: Icon
  export const Pause: Icon
  export const ArrowRight: Icon
  export const ArrowUpRight: Icon
  export const BellRinging: Icon
  export const CalendarCheck: Icon
  export const CaretLeft: Icon
  export const CaretRight: Icon
  export const Clock: Icon
  export const EnvelopeSimple: Icon
  export const Heart: Icon
  export const Hourglass: Icon
  export const Lightning: Icon
  export const Check: Icon
  export const Sun: Icon
  export const Moon: Icon
  export const Eye: Icon
  export const EyeSlash: Icon
  export const MagnifyingGlass: Icon
  export const DiscordLogo: Icon
  export const FacebookLogo: Icon
  export const GithubLogo: Icon
  export const LinkedinLogo: Icon
  export const List: Icon
  export const CheckCircle: Icon
  export const Copy: Icon
  export const CaretDown: Icon
  export const MapPin: Icon
}
