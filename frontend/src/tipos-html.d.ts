// <selectedcontent> es parte del select personalizable (HTML): React todavía no lo tipa
import 'react'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      selectedcontent: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
    }
  }
}
