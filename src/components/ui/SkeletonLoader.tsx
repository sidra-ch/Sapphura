'use client'

import { motion } from 'framer-motion'

type SkeletonLoaderProps = {
  type?: 'card' | 'product' | 'text' | 'line' | 'circle'
  count?: number
  width?: string | number
  height?: string | number
  radius?: string | number
  className?: string
}

export default function SkeletonLoader({
  type = 'card',
  count = 1,
  width = '100%',
  height = '200px',
  radius = '8px',
  className = '',
}: SkeletonLoaderProps) {
  const skeletonVariants = {
    animate: {
      backgroundPosition: ['0% 0%', '100% 0%'],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  }

  const skeletonStyle = {
    background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%)',
    backgroundSize: '200% 100%',
  }

  if (type === 'product') {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(count)].map((_, i) => (
          <motion.div
            key={i}
            variants={skeletonVariants}
            animate="animate"
            className="rounded-xl overflow-hidden"
            style={skeletonStyle}
          >
            <div className="aspect-square bg-navy-light rounded-xl mb-3" />
            <div className="h-5 bg-navy-light rounded w-3/4 mb-2" />
            <div className="h-4 bg-navy-light rounded w-1/2" />
            <div className="h-6 bg-navy-light rounded w-2/3 mt-3" />
          </motion.div>
        ))}
      </div>
    )
  }

  if (type === 'text') {
    return (
      <div className={`space-y-2 ${className}`}>
        {[...Array(count)].map((_, i) => (
          <motion.div
            key={i}
            variants={skeletonVariants}
            animate="animate"
            className="h-4 bg-navy-light rounded"
            style={{ ...skeletonStyle, width: i === count - 1 ? '60%' : '100%' }}
          />
        ))}
      </div>
    )
  }

  if (type === 'line') {
    return (
      <motion.div
        variants={skeletonVariants}
        animate="animate"
        className="rounded"
        style={{
          width,
          height,
          ...skeletonStyle,
        }}
      />
    )
  }

  if (type === 'circle') {
    return (
      <motion.div
        variants={skeletonVariants}
        animate="animate"
        className="rounded-full"
        style={{
          width,
          height: width,
          ...skeletonStyle,
        }}
      />
    )
  }

  // Default: card
  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          variants={skeletonVariants}
          animate="animate"
          className="rounded-xl overflow-hidden p-4 space-y-3"
          style={skeletonStyle}
        >
          <div className="h-6 bg-navy-light rounded w-3/4" />
          <div className="h-4 bg-navy-light rounded w-full" />
          <div className="h-4 bg-navy-light rounded w-5/6" />
        </motion.div>
      ))}
    </div>
  )
}
