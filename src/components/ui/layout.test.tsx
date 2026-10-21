import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Container, Grid, Section, Stack } from './index'

describe('Layout Components', () => {
  it('renders Container with size constraints', () => {
    const { container } = render(<Container size="md">Content</Container>)
    expect(container.firstChild).toHaveClass('max-w-screen-md')
  })

  it('renders Stack with direction and gap', () => {
    const { container } = render(
      <Stack direction="row" gap="lg">
        <div>A</div>
        <div>B</div>
      </Stack>,
    )
    expect(container.firstChild).toHaveClass('flex-row')
    expect(container.firstChild).toHaveClass('gap-6')
  })

  it('renders Grid with column and gap classes', () => {
    const { container } = render(
      <Grid cols={4} gap="sm">
        <div>Item</div>
      </Grid>,
    )
    expect(container.firstChild).toHaveClass('grid')
    expect(container.firstChild).toHaveClass('gap-4')
  })

  it('renders Section element with semantic tag', () => {
    render(<Section data-testid="test-section">Section content</Section>)
    const section = screen.getByTestId('test-section')
    expect(section.tagName).toBe('SECTION')
  })
})
