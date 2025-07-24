import Tabs from '@/components/Tabs'
import { render, screen, fireEvent } from '@testing-library/react'

describe('Tabs', () => {
  const defaultProps = {
    active: 'all',
    onChange: jest.fn(),
  }

  it('renders all tab levels', () => {
    render(<Tabs {...defaultProps} />)
    
    expect(screen.getByText('Tüm Seviyeler')).toBeTruthy()
    expect(screen.getByText('Sv1')).toBeTruthy()
    expect(screen.getByText('Sv2')).toBeTruthy()
    expect(screen.getByText('Max Sv')).toBeTruthy()
  })

  it('highlights active tab', () => {
    render(<Tabs {...defaultProps} />)
    
    const activeTab = screen.getByText('Tüm Seviyeler').closest('button')
    expect(activeTab?.className).toContain('text-[#111216]')
  })

  it('calls onChange when tab is clicked', () => {
    const mockOnChange = jest.fn()
    render(<Tabs active="all" onChange={mockOnChange} />)
    
    const tab2 = screen.getByText('Sv1')
    fireEvent.click(tab2)
    
    expect(mockOnChange).toHaveBeenCalledWith('lv1')
  })

  it('applies custom className', () => {
    const { container } = render(
      <Tabs {...defaultProps} className="custom-class" />
    )
    
    expect((container.firstChild as HTMLElement)?.className).toContain('custom-class')
  })
}) 