// Typography (Task 7)
export { Heading, type HeadingProps } from './heading'
export { Text, type TextProps, type TextTag } from './text'
export { Label, type LabelProps } from './label'
export { Caption, type CaptionProps, type CaptionTag } from './caption'
export {
  headingVariants,
  textVariants,
  labelVariants,
  captionVariants,
} from './typography.variants'

// Button (Task 8)
export { Button, type ButtonProps } from './button'
export { buttonVariants } from './button.variants'

// Icon Button (Task 9)
export { IconButton, type IconButtonProps } from './icon-button'
export { iconButtonVariants } from './icon-button.variants'

// Card (Task 10)
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  type CardProps,
} from './card'
export { cardVariants } from './card.variants'

// Inputs (Task 11)
export { Input, type InputProps } from './input'
export { TextArea, type TextAreaProps } from './textarea'
export { SearchInput, type SearchInputProps } from './search-input'
export { inputVariants, textareaVariants } from './input.variants'

// Selects (Task 12)
export { Select, type SelectProps, type SelectOption } from './select'
export { MultiSelect, type MultiSelectProps } from './multi-select'
export { selectTriggerVariants } from './select.variants'

// Checkbox (Task 13)
export { Checkbox, type CheckboxProps } from './checkbox'
export { checkboxVariants } from './checkbox.variants'

// Radio Group (Task 14)
export {
  RadioGroup,
  RadioGroupItem,
  type RadioGroupProps,
  type RadioGroupItemProps,
} from './radio-group'
export { radioItemVariants } from './radio-group.variants'

// Switch (Task 15)
export { Switch, type SwitchProps } from './switch'
export { switchTrackVariants, switchThumbVariants } from './switch.variants'

// Badge (Task 16)
export { Badge, type BadgeProps } from './badge'
export { badgeVariants } from './badge.variants'

// Tooltip (Task 17)
export { Tooltip, type TooltipProps, type TooltipPlacement } from './tooltip'

// Dialog / Modal (Task 18)
export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  type DialogProps,
  type DialogContentProps,
} from './dialog'
export { dialogContentVariants } from './dialog.variants'

// Alert (Task 19)
export { Alert, type AlertProps } from './alert'
export { alertVariants } from './alert.variants'

// Toast System (Task 20)
export { Toaster } from './toast'
export { toast, useToastStore, type ToastItem, type ToastVariant } from './toast.store'

// Loaders (Task 21)
export {
  Spinner,
  Skeleton,
  PageLoader,
  type SpinnerProps,
  type SkeletonProps,
  type PageLoaderProps,
} from './loader'
export { spinnerVariants, skeletonVariants } from './loader.variants'

// Progress (Task 22)
export {
  ProgressBar,
  CircularProgress,
  type ProgressBarProps,
  type CircularProgressProps,
} from './progress'

// Empty State (Task 23)
export { EmptyState, type EmptyStateProps } from './empty-state'

// Pagination (Task 24)
export { Pagination, type PaginationProps } from './pagination'

// Table (Task 25)
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  type TableHeadProps,
} from './table'

// Form (Task 26)
export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from './form'
export { useFormField, type FormFieldContextValue, type FormItemContextValue } from './form.context'

// Confirm Dialog (Task 27)
export { ConfirmDialog, type ConfirmDialogProps } from './confirm-dialog'

// Layout (Task 28)
export {
  Container,
  Stack,
  Grid,
  Section,
  type ContainerProps,
  type StackProps,
  type GridProps,
  type SectionProps,
} from './layout'
