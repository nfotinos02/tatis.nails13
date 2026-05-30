'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import {
  User, Mail, Phone, ChevronRight, ChevronLeft,
  Upload, X, Loader2, Check, Info
} from 'lucide-react'
import { cn, getMinDate, formatFileSize, isValidImageType } from '@/lib/utils'
import {
  NailShape, NailLength, BudgetRange,
  NAIL_SHAPE_LABELS, NAIL_LENGTH_LABELS, BUDGET_RANGE_LABELS
} from '@/lib/types'

// ─── Validation Schema ────────────────────────────────────────────────────────
const schema = z.object({
  // Step 1
  customer_name: z.string().min(2, 'Please enter your name'),
  customer_email: z.string().email('Please enter a valid email'),
  customer_phone: z.string().min(10, 'Please enter a valid phone number'),
  // Step 2
  nail_shape: z.enum(['almond', 'coffin', 'square', 'oval', 'stiletto'] as const),
  nail_length: z.enum(['short', 'medium', 'long', 'extra-long'] as const),
  primary_color: z.string().min(1, 'Please describe your primary color'),
  secondary_color: z.string().optional(),
  design_notes: z.string().optional(),
  // Step 3 — sizing
  use_measurements: z.boolean().default(true),
  thumb_size: z.string().optional(),
  index_size: z.string().optional(),
  middle_size: z.string().optional(),
  ring_size: z.string().optional(),
  pinky_size: z.string().optional(),
  // Step 4
  desired_completion_date: z.string().min(1, 'Please select a date'),
  quantity: z.coerce.number().min(1).max(10),
  budget_range: z.enum(['under-25', '25-50', '50-75', '75-100', '100+'] as const),
})

type FormData = z.infer<typeof schema>

// ─── Constants ────────────────────────────────────────────────────────────────
const STEPS = ['Your Info', 'Design', 'Sizing', 'Details']

const SHAPES: NailShape[] = ['almond', 'coffin', 'square', 'oval', 'stiletto']
const LENGTHS: NailLength[] = ['short', 'medium', 'long', 'extra-long']
const BUDGETS: BudgetRange[] = ['under-25', '25-50', '50-75', '75-100', '100+']

const FINGER_SIZES = [
  { key: 'thumb_size' as const, label: 'Thumb' },
  { key: 'index_size' as const, label: 'Index' },
  { key: 'middle_size' as const, label: 'Middle' },
  { key: 'ring_size' as const, label: 'Ring' },
  { key: 'pinky_size' as const, label: 'Pinky' },
]

const MAX_FILES = 5
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

// ─── Component ────────────────────────────────────────────────────────────────
export default function OrderForm() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [files, setFiles] = useState<File[]>([])
  const [sizePhoto, setSizePhoto] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nail_shape: 'almond',
      nail_length: 'medium',
      quantity: 1,
      budget_range: '25-50',
      use_measurements: true,
    },
  })

  const useMeasurements = watch('use_measurements')

  // ─── Dropzone — Inspiration Images ───────────────────────────────────────
  const onDropInspiration = useCallback((accepted: File[]) => {
    const valid = accepted.filter(isValidImageType)
    const toAdd = valid.slice(0, MAX_FILES - files.length)
    if (toAdd.length < valid.length) toast.error(`Max ${MAX_FILES} inspiration images`)
    setFiles((prev) => [...prev, ...toAdd])
  }, [files])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropInspiration,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.heic'] },
    maxSize: MAX_FILE_SIZE,
    maxFiles: MAX_FILES,
  })

  const removeFile = (idx: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== idx))

  // ─── Step validation ──────────────────────────────────────────────────────
  const stepFields: Record<number, (keyof FormData)[]> = {
    0: ['customer_name', 'customer_email', 'customer_phone'],
    1: ['nail_shape', 'nail_length', 'primary_color'],
    2: [],
    3: ['desired_completion_date', 'quantity', 'budget_range'],
  }

  const nextStep = async () => {
    const valid = await trigger(stepFields[step])
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  const prevStep = () => setStep((s) => Math.max(s - 1, 0))

  // ─── Submit ───────────────────────────────────────────────────────────────
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()

      // Append form fields
      Object.entries(data).forEach(([k, v]) => {
        if (v !== undefined && v !== null) formData.append(k, String(v))
      })

      // Append files
      files.forEach((file) => formData.append('inspiration_images', file))
      if (sizePhoto) formData.append('size_photo', sizePhoto)

      const res = await fetch('/api/orders', { method: 'POST', body: formData })
      const json = await res.json()

      if (!res.ok) throw new Error(json.error || 'Something went wrong')

      router.push(`/order/confirmation/${json.orderId}`)
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between mb-3">
          {STEPS.map((label, i) => (
            <div
              key={label}
              className={cn(
                'flex flex-col items-center gap-1.5 flex-1',
                i < step ? 'text-champagne-600' : i === step ? 'text-mink' : 'text-nude-300'
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all',
                  i < step
                    ? 'bg-gradient-brand border-transparent text-white'
                    : i === step
                    ? 'border-champagne-500 text-champagne-600 bg-white'
                    : 'border-nude-200 text-nude-300 bg-white'
                )}
              >
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span className="text-xs font-medium hidden sm:block">{label}</span>
            </div>
          ))}
        </div>
        {/* Progress bar */}
        <div className="h-1.5 bg-nude-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-brand rounded-full"
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="card p-6 md:p-8 mb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {/* ── STEP 0: Customer Info ─── */}
            {step === 0 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-display text-2xl text-mink mb-1">Your Information</h2>
                  <p className="text-nude-500 text-sm">So I can reach out to confirm your design.</p>
                </div>

                <div>
                  <label className="label">
                    <span className="flex items-center gap-1.5"><User size={13} /> Full Name</span>
                  </label>
                  <input {...register('customer_name')} className="input" placeholder="e.g. Aaliyah Johnson" />
                  {errors.customer_name && <p className="text-red-500 text-xs mt-1">{errors.customer_name.message}</p>}
                </div>

                <div>
                  <label className="label">
                    <span className="flex items-center gap-1.5"><Mail size={13} /> Email Address</span>
                  </label>
                  <input {...register('customer_email')} type="email" className="input" placeholder="you@example.com" />
                  {errors.customer_email && <p className="text-red-500 text-xs mt-1">{errors.customer_email.message}</p>}
                </div>

                <div>
                  <label className="label">
                    <span className="flex items-center gap-1.5"><Phone size={13} /> Phone Number</span>
                  </label>
                  <input {...register('customer_phone')} type="tel" className="input" placeholder="(555) 000-0000" />
                  {errors.customer_phone && <p className="text-red-500 text-xs mt-1">{errors.customer_phone.message}</p>}
                </div>
              </div>
            )}

            {/* ── STEP 1: Design ─── */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl text-mink mb-1">Design Details</h2>
                  <p className="text-nude-500 text-sm">Tell me about your dream nails!</p>
                </div>

                {/* Shape */}
                <div>
                  <label className="label">Nail Shape</label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {SHAPES.map((shape) => (
                      <button
                        key={shape}
                        type="button"
                        onClick={() => setValue('nail_shape', shape)}
                        className={cn(
                          'py-2.5 px-2 rounded-xl border-2 text-xs font-medium transition-all',
                          watch('nail_shape') === shape
                            ? 'border-champagne-500 bg-champagne-50 text-champagne-700'
                            : 'border-nude-200 text-nude-600 hover:border-nude-300'
                        )}
                      >
                        {NAIL_SHAPE_LABELS[shape]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Length */}
                <div>
                  <label className="label">Nail Length</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {LENGTHS.map((length) => (
                      <button
                        key={length}
                        type="button"
                        onClick={() => setValue('nail_length', length)}
                        className={cn(
                          'py-2.5 px-2 rounded-xl border-2 text-xs font-medium transition-all',
                          watch('nail_length') === length
                            ? 'border-champagne-500 bg-champagne-50 text-champagne-700'
                            : 'border-nude-200 text-nude-600 hover:border-nude-300'
                        )}
                      >
                        {NAIL_LENGTH_LABELS[length]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Primary Color *</label>
                    <input
                      {...register('primary_color')}
                      className="input"
                      placeholder="e.g. Dusty rose, Nude beige"
                    />
                    {errors.primary_color && <p className="text-red-500 text-xs mt-1">{errors.primary_color.message}</p>}
                  </div>
                  <div>
                    <label className="label">Secondary Color <span className="text-nude-400 font-normal">(optional)</span></label>
                    <input
                      {...register('secondary_color')}
                      className="input"
                      placeholder="e.g. Gold glitter, White"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="label">Special Design Notes <span className="text-nude-400 font-normal">(optional)</span></label>
                  <textarea
                    {...register('design_notes')}
                    className="input min-h-[100px] resize-none"
                    placeholder="Describe your vision! e.g. 'Ombre effect from nude to champagne, rhinestone accents on ring finger, glossy finish'"
                  />
                </div>

                {/* Inspiration upload */}
                <div>
                  <label className="label">Inspiration Photos <span className="text-nude-400 font-normal">(up to 5)</span></label>
                  <div
                    {...getRootProps()}
                    className={cn(
                      'border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all',
                      isDragActive
                        ? 'border-champagne-400 bg-champagne-50'
                        : 'border-nude-200 hover:border-nude-300 hover:bg-nude-50'
                    )}
                  >
                    <input {...getInputProps()} />
                    <Upload size={24} className="mx-auto mb-3 text-nude-400" />
                    <p className="text-sm text-nude-600 font-medium">
                      {isDragActive ? 'Drop your photos here!' : 'Drop photos or click to upload'}
                    </p>
                    <p className="text-xs text-nude-400 mt-1">
                      Pinterest screenshots, TikTok saves, inspo pics — anything works! Max 10MB each.
                    </p>
                  </div>

                  {files.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {files.map((file, i) => (
                        <div key={i} className="flex items-center gap-3 p-2.5 bg-nude-50 rounded-xl">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-nude-200 flex-shrink-0">
                            <img
                              src={URL.createObjectURL(file)}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-mink font-medium truncate">{file.name}</p>
                            <p className="text-xs text-nude-400">{formatFileSize(file.size)}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(i)}
                            className="text-nude-400 hover:text-red-400 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── STEP 2: Sizing ─── */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl text-mink mb-1">Nail Sizing</h2>
                  <p className="text-nude-500 text-sm">Getting the sizing right ensures the perfect fit.</p>
                </div>

                {/* Toggle */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setValue('use_measurements', true)}
                    className={cn(
                      'flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all',
                      useMeasurements
                        ? 'border-champagne-500 bg-champagne-50 text-champagne-700'
                        : 'border-nude-200 text-nude-500 hover:border-nude-300'
                    )}
                  >
                    Enter Measurements
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue('use_measurements', false)}
                    className={cn(
                      'flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all',
                      !useMeasurements
                        ? 'border-champagne-500 bg-champagne-50 text-champagne-700'
                        : 'border-nude-200 text-nude-500 hover:border-nude-300'
                    )}
                  >
                    Upload Photo
                  </button>
                </div>

                {useMeasurements ? (
                  <>
                    <div className="p-4 bg-champagne-50 rounded-2xl flex gap-3">
                      <Info size={16} className="text-champagne-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-champagne-700 leading-relaxed">
                        Use a measuring tape or ruler to measure the width of each nail at its widest point in millimeters (mm). Example: Thumb = 16mm.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {FINGER_SIZES.map(({ key, label }) => (
                        <div key={key}>
                          <label className="label text-xs">{label}</label>
                          <div className="relative">
                            <input
                              {...register(key)}
                              className="input pr-10"
                              placeholder="e.g. 15"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-nude-400 text-xs font-medium">mm</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <p className="text-xs text-nude-400">
                      * Sizing is optional but helps me create the most accurate fit. You can also skip this and I&apos;ll ask during confirmation.
                    </p>
                  </>
                ) : (
                  <div>
                    <div
                      className={cn(
                        'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all',
                        sizePhoto ? 'border-champagne-400 bg-champagne-50' : 'border-nude-200 hover:border-nude-300'
                      )}
                      onClick={() => document.getElementById('size-photo-input')?.click()}
                    >
                      <input
                        id="size-photo-input"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) setSizePhoto(file)
                        }}
                      />
                      {sizePhoto ? (
                        <div className="flex items-center gap-3 justify-center">
                          <Check size={20} className="text-champagne-600" />
                          <span className="text-sm text-champagne-700 font-medium">{sizePhoto.name}</span>
                          <button type="button" onClick={(e) => { e.stopPropagation(); setSizePhoto(null) }}>
                            <X size={16} className="text-nude-400 hover:text-red-400" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload size={24} className="mx-auto mb-3 text-nude-400" />
                          <p className="text-sm text-nude-600 font-medium">Upload a hand photo with measuring tape</p>
                          <p className="text-xs text-nude-400 mt-1">Place a ruler or measuring tape across your nails and take a photo</p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 3: Order Details ─── */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-display text-2xl text-mink mb-1">Order Details</h2>
                  <p className="text-nude-500 text-sm">Almost done — just a few more details!</p>
                </div>

                <div>
                  <label className="label">Desired Completion Date</label>
                  <input
                    {...register('desired_completion_date')}
                    type="date"
                    min={getMinDate()}
                    className="input"
                  />
                  {errors.desired_completion_date && (
                    <p className="text-red-500 text-xs mt-1">{errors.desired_completion_date.message}</p>
                  )}
                  <p className="text-xs text-nude-400 mt-1">
                    Please allow at least 3–7 days for handcrafting. Rush orders may be available — ask in your notes!
                  </p>
                </div>

                <div>
                  <label className="label">Number of Sets</label>
                  <select {...register('quantity')} className="input">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n} set{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Budget Range</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {BUDGETS.map((budget) => (
                      <button
                        key={budget}
                        type="button"
                        onClick={() => setValue('budget_range', budget)}
                        className={cn(
                          'py-2.5 px-3 rounded-xl border-2 text-xs font-medium transition-all text-left',
                          watch('budget_range') === budget
                            ? 'border-champagne-500 bg-champagne-50 text-champagne-700'
                            : 'border-nude-200 text-nude-600 hover:border-nude-300'
                        )}
                      >
                        {BUDGET_RANGE_LABELS[budget]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Order summary */}
                <div className="bg-gradient-nude rounded-2xl p-5 space-y-2.5">
                  <h3 className="text-sm font-semibold text-mink mb-3">Order Summary</h3>
                  {[
                    ['Shape', NAIL_SHAPE_LABELS[watch('nail_shape') as NailShape]],
                    ['Length', NAIL_LENGTH_LABELS[watch('nail_length') as NailLength]],
                    ['Primary Color', watch('primary_color') || '—'],
                    ['Inspiration Photos', `${files.length} uploaded`],
                    ['Quantity', `${watch('quantity')} set${watch('quantity') > 1 ? 's' : ''}`],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between text-xs">
                      <span className="text-nude-500">{label}</span>
                      <span className="text-mink font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        {step > 0 && (
          <button type="button" onClick={prevStep} className="btn-outline flex-1">
            <ChevronLeft size={16} />
            Back
          </button>
        )}

        {step < STEPS.length - 1 ? (
          <button type="button" onClick={nextStep} className="btn-primary flex-1">
            Continue
            <ChevronRight size={16} />
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex-1 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit Order ✨
              </>
            )}
          </button>
        )}
      </div>
    </form>
  )
}
