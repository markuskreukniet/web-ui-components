import type { ParentComponent } from 'solid-js';

type LayoutProps = {}

export const Layout: ParentComponent<LayoutProps> = (props) => (
  <div>
    <main>{props.children}</main>
  </div>
)
