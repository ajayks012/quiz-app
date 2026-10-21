import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './index'
import { Input } from '../input'

interface FormValues {
  username: string
}

const TestFormComponent = () => {
  const form = useForm<FormValues>({
    defaultValues: { username: '' },
  })

  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter username" {...field} />
              </FormControl>
              <FormDescription>Your public display handle</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

describe('Form Components', () => {
  it('renders form item with label, input, and description', () => {
    render(<TestFormComponent />)

    expect(screen.getByText('Username')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument()
    expect(screen.getByText('Your public display handle')).toBeInTheDocument()
  })
})
