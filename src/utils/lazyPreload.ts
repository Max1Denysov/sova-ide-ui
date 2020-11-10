import React from 'react'

const lazyWithPreload = (factory: () => Promise<any>) => {
  const Component: any = React.lazy(factory)
  Component.preload = factory
  return Component
}

export default lazyWithPreload
