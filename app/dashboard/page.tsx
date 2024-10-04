import { Suspense } from 'react'

 
export default function Posts() {
  return (
    <section>
      <Suspense fallback={<p>Loading feed...</p>}>
        
      </Suspense>
      <Suspense fallback={<p>Loading weather...</p>}>
        
      </Suspense>
    </section>
  )
}