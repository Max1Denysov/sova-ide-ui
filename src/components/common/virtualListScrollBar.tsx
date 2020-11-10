import React from 'react'
import Scrollbars from 'react-scrollbars-custom'
import { RandomObject } from '../../@types/common'

interface DefaultVirtualListTypes {
  onScroll(ev: React.UIEvent<HTMLDivElement>): void
  forwardedRef: React.Ref<HTMLDivElement>
  style: RandomObject
  children: React.ReactNode
  className?: string
}

export const DefaultVirtualListScrollbar = ({
  onScroll,
  forwardedRef,
  style,
  children,
  className,
}: DefaultVirtualListTypes) => {
  return (
    <Scrollbars
      className={className}
      style={style}
      scrollerProps={{
        renderer: ({ elementRef, onScroll: rscOnScroll, ...restProps }) => (
          <div
            {...restProps}
            onScroll={ev => {
              onScroll(ev)
              rscOnScroll && rscOnScroll(ev)
            }}
            ref={ref => {
              // @ts-ignore
              forwardedRef && forwardedRef(ref)
              elementRef && elementRef(ref)
            }}
          />
        ),
      }}
    >
      {children}
    </Scrollbars>
  )
}

const VirtualListScrollbar = React.forwardRef((props: DefaultVirtualListTypes, ref: React.Ref<HTMLDivElement>) => (
  <DefaultVirtualListScrollbar {...props} forwardedRef={ref} />
))

export default VirtualListScrollbar
