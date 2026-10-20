import { useEffect } from 'react'

const revealSelector = [
  '.benefits-grid > div',
  '.section-topline',
  '.section-heading-row > *',
  '.products-toolbar',
  '.product-card',
  '.catalog-note',
  '.about-visual',
  '.about-content > .eyebrow',
  '.about-content > h2',
  '.about-intro',
  '.about-values > div',
  '.about-content > .text-link',
  '.process-step',
  '.calculator-section-heading > *',
  '.calculator-layout',
  '.faq-grid > div:first-child > *',
  '.faq-item',
  '.contact-card',
  '.footer-main > *',
].join(',')

/** Progressive enhancement: all content remains readable without motion APIs. */
export function useSiteMotion() {
  useEffect(() => {
    const root = document.documentElement
    const main = document.querySelector('main')
    const hero = document.querySelector<HTMLElement>('.hero')
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)')
    const observed = new Set<HTMLElement>()
    const animations = new Set<Animation>()
    let observer: IntersectionObserver | null = null
    let mutations: MutationObserver | null = null
    let scrollFrame = 0
    let pointerFrame = 0
    let heroFrame = 0
    let activeCard: HTMLElement | null = null

    function reveal(element: HTMLElement, immediate = false) {
      if (element.dataset.motionReveal !== 'pending') return
      element.dataset.motionReveal = 'visible'
      observer?.unobserve(element)
      if (immediate || reduced.matches || !element.animate) return

      const siblings = Array.from(element.parentElement?.children ?? []).filter(sibling => sibling.matches(revealSelector))
      const delay = Math.min(Math.max(siblings.indexOf(element), 0) * 65, 195)
      element.style.setProperty('--reveal-delay', `${delay}ms`)
      const animation = element.animate([
        { opacity: 0, transform: 'translate3d(0, 24px, 0)' },
        { opacity: 1, transform: 'translate3d(0, 0, 0)' },
      ], { duration: 680, delay, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'backwards' })
      animations.add(animation)
      animation.finished.then(() => animations.delete(animation), () => animations.delete(animation))
    }

    function register(element: HTMLElement) {
      if (observed.has(element)) return
      observed.add(element)
      // Elements above the viewport must not disappear when filters rerender.
      if (element.getBoundingClientRect().bottom < 0) {
        element.dataset.motionReveal = 'visible'
        return
      }
      element.dataset.motionReveal = 'pending'
      observer?.observe(element)
    }

    function scan(node: Element) {
      if (node instanceof HTMLElement && node.matches(revealSelector)) register(node)
      node.querySelectorAll<HTMLElement>(revealSelector).forEach(register)
    }

    function stopReveals() {
      observer?.disconnect()
      mutations?.disconnect()
      observer = null
      mutations = null
      animations.forEach(animation => animation.cancel())
      animations.clear()
      observed.forEach(element => { element.dataset.motionReveal = 'visible' })
      root.classList.remove('motion-ready')
    }

    function configureMotion() {
      stopReveals()
      resetCard()
      hero?.style.removeProperty('--hero-x')
      hero?.style.removeProperty('--hero-y')
      hero?.style.removeProperty('--hero-scroll')
      if (reduced.matches || !main || !('IntersectionObserver' in window)) return
      root.classList.add('motion-ready')
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => { if (entry.isIntersecting) reveal(entry.target as HTMLElement) })
      }, { threshold: 0.06, rootMargin: '0px 0px -24px 0px' })
      scan(document.body)
      mutations = new MutationObserver(records => {
        records.forEach(record => {
          record.addedNodes.forEach(node => { if (node instanceof Element) scan(node) })
          record.removedNodes.forEach(node => {
            if (!(node instanceof Element)) return
            observed.forEach(element => {
              if (element === node || node.contains(element)) {
                observer?.unobserve(element)
                observed.delete(element)
              }
            })
          })
        })
      })
      mutations.observe(main, { childList: true, subtree: true })
    }

    function updateScroll() {
      scrollFrame = 0
      const scrollable = root.scrollHeight - window.innerHeight
      root.style.setProperty('--page-progress', String(scrollable > 0 ? Math.min(Math.max(window.scrollY / scrollable, 0), 1) : 0))
      if (hero && !reduced.matches && finePointer.matches) {
        const bounds = hero.getBoundingClientRect()
        if (bounds.bottom >= 0) {
          hero.style.setProperty('--hero-scroll', `${Math.min(Math.max(-bounds.top * 0.025, 0), 12).toFixed(2)}px`)
        }
      }
    }

    function onScroll() {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll)
    }

    function resetCard() {
      if (!activeCard) return
      activeCard.style.removeProperty('--tilt-x')
      activeCard.style.removeProperty('--tilt-y')
      activeCard = null
    }

    function onCardMove(event: PointerEvent) {
      if (reduced.matches || !finePointer.matches || event.pointerType === 'touch') return
      const card = event.target instanceof Element ? event.target.closest<HTMLElement>('.product-card') : null
      if (card !== activeCard) { resetCard(); activeCard = card }
      if (!card) return
      cancelAnimationFrame(pointerFrame)
      pointerFrame = requestAnimationFrame(() => {
        const bounds = card.getBoundingClientRect()
        const x = Math.min(Math.max((event.clientX - bounds.left) / bounds.width, 0), 1)
        const y = Math.min(Math.max((event.clientY - bounds.top) / bounds.height, 0), 1)
        card.style.setProperty('--tilt-x', `${((0.5 - y) * 5).toFixed(2)}deg`)
        card.style.setProperty('--tilt-y', `${((x - 0.5) * 5).toFixed(2)}deg`)
        card.style.setProperty('--glow-x', `${(x * 100).toFixed(1)}%`)
        card.style.setProperty('--glow-y', `${(y * 100).toFixed(1)}%`)
      })
    }

    function onCardOut(event: PointerEvent) {
      if (activeCard && (!(event.relatedTarget instanceof Node) || !activeCard.contains(event.relatedTarget))) {
        cancelAnimationFrame(pointerFrame)
        resetCard()
      }
    }

    function onHeroMove(event: PointerEvent) {
      if (!hero || reduced.matches || !finePointer.matches || event.pointerType === 'touch') return
      cancelAnimationFrame(heroFrame)
      heroFrame = requestAnimationFrame(() => {
        const bounds = hero.getBoundingClientRect()
        hero.style.setProperty('--hero-x', `${((event.clientX - bounds.left) / bounds.width - 0.5) * -8}px`)
        hero.style.setProperty('--hero-y', `${((event.clientY - bounds.top) / bounds.height - 0.5) * -6}px`)
      })
    }

    function onHeroLeave() {
      cancelAnimationFrame(heroFrame)
      hero?.style.setProperty('--hero-x', '0px')
      hero?.style.setProperty('--hero-y', '0px')
    }

    function onFocus(event: FocusEvent) {
      let element = event.target instanceof HTMLElement ? event.target : null
      while (element) {
        if (element.dataset.motionReveal === 'pending') reveal(element, true)
        element = element.parentElement
      }
    }

    configureMotion()
    updateScroll()
    reduced.addEventListener('change', configureMotion)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    main?.addEventListener('pointermove', onCardMove as EventListener, { passive: true })
    main?.addEventListener('pointerout', onCardOut as EventListener, { passive: true })
    hero?.addEventListener('pointermove', onHeroMove, { passive: true })
    hero?.addEventListener('pointerleave', onHeroLeave, { passive: true })
    document.addEventListener('focusin', onFocus)

    return () => {
      stopReveals()
      observed.forEach(element => { delete element.dataset.motionReveal })
      resetCard()
      onHeroLeave()
      hero?.style.removeProperty('--hero-scroll')
      root.style.removeProperty('--page-progress')
      cancelAnimationFrame(scrollFrame)
      cancelAnimationFrame(pointerFrame)
      cancelAnimationFrame(heroFrame)
      reduced.removeEventListener('change', configureMotion)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      main?.removeEventListener('pointermove', onCardMove as EventListener)
      main?.removeEventListener('pointerout', onCardOut as EventListener)
      hero?.removeEventListener('pointermove', onHeroMove)
      hero?.removeEventListener('pointerleave', onHeroLeave)
      document.removeEventListener('focusin', onFocus)
    }
  }, [])
}
