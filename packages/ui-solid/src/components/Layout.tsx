import type { ParentComponent } from 'solid-js'

export const Layout: ParentComponent = props => (
  <div>
    <main>{props.children}</main>
  </div>
)
