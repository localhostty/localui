import type { Component } from 'solid-js'
import { Button } from '../../src/button'

const App: Component = () => {
    return (
        <div class="p-3">
            <p class="text-4xl text-green-700 text-center py-20">Hello tailwind!</p>
            <Button class="border-2 px-3 py-2 rounded-xl border-neutral-500 hover:bg-neutral-200 active:bg-neutral-100">
                Test
            </Button>
        </div>
    )
}

export default App
