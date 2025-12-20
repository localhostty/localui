import * as Solid from 'solid-js'

export function Button(props: any) {
    const [local, others] = Solid.splitProps(props, ['children'])
    return <button {...others}>{local.children}</button>
}
