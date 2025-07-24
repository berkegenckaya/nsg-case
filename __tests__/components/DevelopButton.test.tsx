import { DevelopButton } from '@/components/DevelopButton'
import { render, screen, fireEvent } from '@testing-library/react'

describe('DevelopButton', () => {
  const defaultProps = {
    cost: 1,
    onClick: jest.fn(),
  }

  it('renders with correct cost', () => {
    render(<DevelopButton {...defaultProps} />)
    
    expect(screen.getByText('-1')).toBeTruthy()
    expect(screen.getByText('Geliştir')).toBeTruthy()
  })

  it('calls onClick when clicked', () => {
    const mockOnClick = jest.fn()
    render(<DevelopButton cost={1} onClick={mockOnClick} />)
    
    const button = screen.getByText('Geliştir').closest('button')
    fireEvent.click(button!)
    
    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  it('applies disabled state', () => {
    render(<DevelopButton {...defaultProps} disabled={true} />)
    
    const button = screen.getByText('Geliştir').closest('button')
    expect(button?.disabled).toBe(true)
  })

  it('applies custom className', () => {
    const { container } = render(
      <DevelopButton {...defaultProps} className="custom-class" />
    )
    
    expect((container.firstChild as HTMLElement)?.className).toContain('custom-class')
  })

  it('uses custom icon when provided', () => {
    render(<DevelopButton {...defaultProps} iconSrc="/custom-energy.png" />)
    
    const img = screen.getByAltText('energy')
    expect(img.getAttribute('src')).toBe('/custom-energy.png')
  })
}) 