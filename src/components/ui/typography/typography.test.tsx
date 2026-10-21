import * as React from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Caption, Heading, Label, Text } from './index'

describe('Typography Components', () => {
  describe('Heading', () => {
    it('renders an h1 element by default', () => {
      render(<Heading>Main Title</Heading>)
      const element = screen.getByRole('heading', { level: 1 })
      expect(element).toBeInTheDocument()
      expect(element).toHaveTextContent('Main Title')
    })

    it('renders proper semantic heading tag matching level prop', () => {
      render(<Heading level="h2">Section Title</Heading>)
      const element = screen.getByRole('heading', { level: 2 })
      expect(element).toBeInTheDocument()
    })

    it('supports display level rendered as h1 with display styles', () => {
      render(<Heading level="display">Hero Title</Heading>)
      const element = screen.getByRole('heading', { level: 1 })
      expect(element.className).toContain('font-extrabold')
    })

    it('supports custom polymorphic as prop', () => {
      render(
        <Heading level="h1" as="span" data-testid="span-heading">
          Span as Heading
        </Heading>,
      )
      const element = screen.getByTestId('span-heading')
      expect(element.tagName).toBe('SPAN')
    })

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLHeadingElement>()
      render(<Heading ref={ref}>Ref Heading</Heading>)
      expect(ref.current).toBeInstanceOf(HTMLHeadingElement)
    })
  })

  describe('Text', () => {
    it('renders a paragraph element by default', () => {
      render(<Text>Body copy</Text>)
      const element = screen.getByText('Body copy')
      expect(element.tagName).toBe('P')
    })

    it('applies tone and size classes', () => {
      render(
        <Text size="sm" tone="muted" truncate>
          Muted small text
        </Text>,
      )
      const element = screen.getByText('Muted small text')
      expect(element.className).toContain('text-sm')
      expect(element.className).toContain('truncate')
    })

    it('renders as custom polymorphic element', () => {
      render(<Text as="span">Inline text</Text>)
      const element = screen.getByText('Inline text')
      expect(element.tagName).toBe('SPAN')
    })

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLElement>()
      render(<Text ref={ref}>Ref Text</Text>)
      expect(ref.current).toBeInstanceOf(HTMLParagraphElement)
    })
  })

  describe('Label', () => {
    it('renders a label element', () => {
      render(<Label htmlFor="email-input">Email address</Label>)
      const element = screen.getByText('Email address')
      expect(element.tagName).toBe('LABEL')
      expect(element).toHaveAttribute('for', 'email-input')
    })

    it('renders required indicator when required is true', () => {
      render(<Label required>Password</Label>)
      expect(screen.getByText('*')).toBeInTheDocument()
    })

    it('supports disabled and error states', () => {
      render(
        <Label disabled error>
          Error field
        </Label>,
      )
      const label = screen.getByText('Error field')
      expect(label).toHaveAttribute('aria-disabled', 'true')
      expect(label.className).toContain('opacity-50')
      expect(label.className).toContain('text-rose-600')
    })
  })

  describe('Caption', () => {
    it('renders caption text with default styling', () => {
      render(<Caption>Helper details</Caption>)
      const element = screen.getByText('Helper details')
      expect(element.tagName).toBe('P')
      expect(element.className).toContain('text-xs')
    })

    it('renders error caption with error styling', () => {
      render(<Caption tone="error">Validation message</Caption>)
      const element = screen.getByText('Validation message')
      expect(element.className).toContain('text-rose-500')
    })

    it('supports custom polymorphic tag', () => {
      render(<Caption as="span">Span caption</Caption>)
      const element = screen.getByText('Span caption')
      expect(element.tagName).toBe('SPAN')
    })
  })
})
