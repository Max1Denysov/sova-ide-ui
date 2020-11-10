import React, { PureComponent } from 'react'
import { RandomObject } from '../@types/common'

interface withArrowNavigationProps extends RandomObject {
  data: any[]
  onSelectDropDownItem: (item: any) => void
}

interface withArrowNavigationState {
  activeItem: number
  activeNode: HTMLDivElement | null
  parentNode: HTMLElement | null
  scrollBool: boolean
  activeItemTrigger: string | null
}

const withArrowNavigation = (WrappedComponent: React.ComponentType<any>) => {
  return class extends PureComponent<withArrowNavigationProps, withArrowNavigationState> {
    state = {
      activeItem: -1,
      activeNode: null,
      parentNode: null,
      scrollBool: true,
      activeItemTrigger: null,
    }

    setActiveNode = (activeNode: HTMLDivElement, parentNode: HTMLElement) => {
      this.setState({ activeNode, parentNode })
    }

    elemInView = (elem: HTMLDivElement | null, parentElem: HTMLElement | null) => {
      if (elem && parentElem) {
        const containerTop = parentElem.getBoundingClientRect().top
        const elemTop = elem.getBoundingClientRect().top
        const containerBottom = containerTop + parentElem.offsetHeight

        const isVisible = elemTop >= containerTop && elemTop < containerBottom

        return isVisible
      }
    }

    scrollToActiveElem = (direction: number, scrollBool: boolean) => {
      this.setState(prevState => ({
        activeItem: prevState.activeItem + direction,
        scrollBool,
        activeItemTrigger: 'keyboard',
      }))
    }

    handleKeyDown = (ev: KeyboardEvent) => {
      const data = this.props.data
      const targetItem = data[this.state.activeItem]
      if (ev.key === 'Enter' && this.state.activeItemTrigger === 'keyboard') {
        ev.preventDefault()
        targetItem && this.props.onSelectDropDownItem(targetItem)
        if (this.props.setDropDown) return this.props.setDropDown(false)
      }
      if (ev.key === 'ArrowUp' && this.state.activeItem) {
        ev.preventDefault()
        this.scrollToActiveElem(-1, true)
      } else if (ev.key === 'ArrowDown' && this.state.activeItem < data.length - 1) {
        ev.preventDefault()
        this.scrollToActiveElem(1, false)
      } else return
    }

    handleMouseEnter = (activeItem: number) => {
      this.setState({ activeItem, activeItemTrigger: 'mouse' })
    }

    componentDidMount() {
      document.addEventListener('keydown', this.handleKeyDown)
    }

    componentDidUpdate(prevProps: withArrowNavigationProps, prevState: withArrowNavigationState) {
      if (prevState.activeNode !== this.state.activeNode) {
        const activeNode = this.state.activeNode as HTMLDivElement | null
        const parentNode = this.state.parentNode as HTMLElement | null
        if (activeNode && !this.elemInView(activeNode, parentNode)) activeNode.scrollIntoView(this.state.scrollBool)
      }
    }

    componentWillUnmount() {
      document.removeEventListener('keydown', this.handleKeyDown)
    }

    render() {
      return (
        <WrappedComponent
          setActiveNode={this.setActiveNode}
          activeItem={this.state.activeItem}
          handleMouseEnter={() => {}}
          {...this.props}
        />
      )
    }
  }
}

export default withArrowNavigation
