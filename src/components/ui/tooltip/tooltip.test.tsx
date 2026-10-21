import { describe, expect, it } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tooltip } from './index'

describe('Tooltip Component', () => {
  it('displays tooltip on hover with delay', async () => {
    const user = userEvent.setup()
    render(
      <Tooltip content="Helpful hint" delay={50}>
        <button type="button">Hover me</button>
      </Tooltip>,
    )

    const button = screen.getByRole('button', { name: /hover me/i })
    await user.hover(button)

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 60))
    })

    expect(screen.getByRole('tooltip')).toHaveTextContent('Helpful hint')
  })
})
