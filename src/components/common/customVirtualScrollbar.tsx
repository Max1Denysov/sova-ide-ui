import React, { PureComponent } from 'react'
import { VariableSizeList, ListOnScrollProps } from 'react-window'
import VirtualListScrollbar from './virtualListScrollBar'
import { RandomObject } from '../../@types/common'
import debounce from 'lodash.debounce'

interface CustomVirtualScrollbarItem {
  index: number
  style: RandomObject
}

interface ScrollbarCustomProps {
  scrollbarsClassName: string
  containerClassName: string
  itemsCount: number
  itemHeight: number
  subitemHeight?: number
  customHeightConfig?: { [key: string]: number }
  propToTriggerUpdate?: any
  getCustomHeight?(index: number): number
  onScroll?(props: ListOnScrollProps, blockHeight: number): void
  children: React.FunctionComponent<CustomVirtualScrollbarItem>
}

interface ScrollbarCustomState {
  containerWidth: number
  containerHeight: number
}

class CustomVirtualScrollbar extends PureComponent<ScrollbarCustomProps, ScrollbarCustomState> {
  state = {
    containerWidth: 0,
    containerHeight: 0
  }

  listRef = React.createRef<VariableSizeList>()
  outerRef = React.createRef()
  containerRef = React.createRef<HTMLDivElement>()

  getItemSize = (index: number) => {
    if (this.props.getCustomHeight) return this.props.getCustomHeight(index)
    if (this.props.customHeightConfig) return this.setCustomItemSize(index, this.props.customHeightConfig)
    return this.props.itemHeight
  }

  setCustomItemSize = (index: number, config: { [key: string]: number }) => {
    return config[index]
      ? this.props.itemHeight + (this.props.subitemHeight || 1) * config[index]
      : this.props.itemHeight
  }

  checkContainerHeight = debounce(() => {
    if (
      this.containerRef.current &&
      (
        this.containerRef.current.clientHeight !== this.state.containerHeight ||
        this.containerRef.current.clientWidth !== this.state.containerWidth
      )
    ) {
      this.setState(() => ({
        containerWidth: this.containerRef.current!.clientWidth,
        containerHeight: this.containerRef.current!.clientHeight
      }))
    }
  }, 100)

  componentDidMount() {
    setTimeout(() => {
      if (this.containerRef.current) {
        this.setState(() => ({
          containerWidth: this.containerRef.current!.clientWidth,
          containerHeight: this.containerRef.current!.clientHeight
        }))
      }
    }, 300)
    window.addEventListener('resize', this.checkContainerHeight)
  }

  componentDidUpdate(prevProps: Readonly<ScrollbarCustomProps>) {
    if (prevProps.customHeightConfig !== this.props.customHeightConfig && this.listRef.current) {
      this.listRef.current.resetAfterIndex(0, true)
    }

    if (prevProps.propToTriggerUpdate !== this.props.propToTriggerUpdate) {
      this.checkContainerHeight()
    }

    this.checkContainerHeight()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.checkContainerHeight)
  }

  render() {
    const { scrollbarsClassName, containerClassName, itemsCount, onScroll, children } = this.props
    const { containerWidth, containerHeight } = this.state
    return (
      <div className={containerClassName}>
        <div ref={this.containerRef} style={{ height: '100%' }}>
          <VariableSizeList
            className={scrollbarsClassName}
            ref={this.listRef}
            width={containerWidth}
            height={containerHeight}
            itemCount={itemsCount}
            itemSize={this.getItemSize}
            outerElementType={VirtualListScrollbar}
            outerRef={this.outerRef}
            onScroll={props => !!onScroll && onScroll(props, containerHeight)}
          >
            {children}
          </VariableSizeList>
        </div>
      </div>
    )
  }
}

export default CustomVirtualScrollbar
