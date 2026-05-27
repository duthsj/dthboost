import { type ReactNode, useState } from 'react'

interface TooltipProps {
  text: string
  children: ReactNode
}

export default function Tooltip({ text, children }: TooltipProps) {
  const [show, setShow] = useState(false)

  return (
    <span
      style={{ position: 'relative', cursor: 'help' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <span style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: 6,
          padding: '6px 12px',
          borderRadius: 8,
          background: 'var(--panel)',
          border: '1px solid var(--border)',
          color: 'var(--text)',
          fontSize: 12,
          lineHeight: 1.4,
          whiteSpace: 'nowrap',
          zIndex: 100,
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          pointerEvents: 'none',
        }}>
          {text}
        </span>
      )}
    </span>
  )
}

// Plain-English explanations for technical terms
export const tooltips = {
  en: {
    'p95 frame time': '95% of frames render faster than this. Lower = smoother.',
    'p99 frame time': '99% of frames render faster than this. Controls worst-case feel.',
    '1% low': 'The average FPS of your worst 1% of frames. This is what you feel as stutter.',
    '0.1% low': 'The average FPS of your worst 0.1% of frames. Controls micro-stutter.',
    'CPU wait': 'Time the CPU spends waiting for the GPU. High = CPU bottleneck.',
    'GPU busy': 'How busy your GPU is. Above 90% = GPU is the limit.',
    'frame pacing': 'How evenly frames are spaced. Bad pacing feels stuttery even with high FPS.',
    'tearing': 'Screen shows parts of two frames at once. VRR/VSync fixes this.',
    'stutter count': 'Number of frames that took 2.5x longer than average. Lower = smoother.',
    'dropped frames': 'Frames that never made it to screen. Affects aim consistency.',
    'bufferbloat': 'Latency spikes when network is busy. Router QoS/SQM can fix this.',
    'standby pressure': 'RAM Windows is holding "just in case". High = apps compete for memory.',
    'hard faults': 'When RAM runs out and Windows uses disk. Very slow. Close background apps.',
    'MMCSS': 'Windows multimedia scheduler. Higher priority = less audio/video stutter.',
    'timer resolution': 'How often Windows checks for input. 0.5ms = more responsive than default 15.6ms.',
    'Spectre/Meltdown': 'CPU security patches that slow down Intel CPUs 3-10%. Disabling is Advanced risk.',
    'MSI Mode': 'Message Signaled Interrupts. Reduces input lag by handling GPU interrupts more efficiently.',
    'GameDVR': 'Windows background recording. Uses GPU encoder even when not recording. Disable for FPS.',
    'fullscreen optimizations': 'Windows tweak for borderless games. Sometimes adds input lag. Try OFF.',
    PresentMon: 'Intel tool that measures real frame data. Required for accurate benchmarks.',
  },
  es: {
    'p95 frame time': '95% de frames renderizan más rápido que esto. Más bajo = más fluido.',
    'p99 frame time': '99% de frames renderizan más rápido. Controla la sensación en el peor caso.',
    '1% low': 'FPS promedio del peor 1% de frames. Esto es lo que sientes como stutter.',
    '0.1% low': 'FPS promedio del peor 0.1% de frames. Controla micro-stutter.',
    'CPU wait': 'Tiempo que la CPU espera a la GPU. Alto = CPU es el límite.',
    'GPU busy': 'Qué tan ocupada está tu GPU. Arriba de 90% = GPU es el límite.',
    'frame pacing': 'Qué tan parejos llegan los frames. Mal pacing se siente trabado aunque haya FPS alto.',
    tearing: 'La pantalla muestra partes de dos frames a la vez. VRR/VSync lo arregla.',
    'stutter count': 'Frames que tardaron 2.5x más que el promedio. Menos = más fluido.',
    'dropped frames': 'Frames que nunca llegaron a pantalla. Afecta consistencia de aim.',
    bufferbloat: 'Picos de latencia cuando la red está ocupada. QoS/SQM del router lo arregla.',
    'standby pressure': 'RAM que Windows guarda "por si acaso". Alta = apps compiten por memoria.',
    'hard faults': 'Cuando falta RAM y Windows usa el disco. Muy lento. Cierra apps de fondo.',
    MMCSS: 'Planificador multimedia de Windows. Prioridad más alta = menos stutter audio/video.',
    'timer resolution': 'Qué tan seguido Windows revisa input. 0.5ms = más responsivo que 15.6ms default.',
    'Spectre/Meltdown': 'Parches de seguridad que bajan rendimiento Intel 3-10%. Desactivar es riesgo Avanzado.',
    'MSI Mode': 'Interrupciones por mensaje. Reduce input lag manejando interrupciones GPU más eficiente.',
    GameDVR: 'Grabación de fondo de Windows. Usa el encoder GPU incluso sin grabar. Desactivar para FPS.',
    'fullscreen optimizations': 'Tweak de Windows para juegos borderless. A veces añade input lag. Probar OFF.',
    PresentMon: 'Herramienta Intel que mide datos reales de frames. Necesaria para benchmarks precisos.',
  },
}
