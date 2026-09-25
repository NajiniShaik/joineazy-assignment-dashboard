import { useEffect, useState } from 'react'

const initialFormValues = {
  title: '',
  description: '',
  dueDate: '',
  driveLink: '',
}

function validateForm(values) {
  const errors = {}

  if (!values.title.trim()) {
    errors.title = 'Enter an assignment title.'
  }

  if (!values.description.trim()) {
    errors.description = 'Enter an assignment description.'
  }

  if (!values.dueDate) {
    errors.dueDate = 'Select a due date.'
  }

  if (!values.driveLink.trim()) {
    errors.driveLink = 'Enter a Drive or resource URL.'
  } else {
    try {
      const url = new URL(values.driveLink)
      if (!['http:', 'https:'].includes(url.protocol)) {
        errors.driveLink = 'Use a valid http:// or https:// URL.'
      }
    } catch {
      errors.driveLink = 'Use a valid http:// or https:// URL.'
    }
  }

  return errors
}

function AssignmentForm({ onCancel, onCreate }) {
  const [values, setValues] = useState(initialFormValues)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') {
        onCancel()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onCancel])

  function handleChange(event) {
    const { name, value } = event.target
    setValues((currentValues) => ({ ...currentValues, [name]: value }))
    setErrors((currentErrors) => ({ ...currentErrors, [name]: '' }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const validationErrors = validateForm(values)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    onCreate({
      title: values.title.trim(),
      description: values.description.trim(),
      dueDate: values.dueDate,
      driveLink: values.driveLink.trim(),
    })
  }

  function getFieldClassName(fieldName) {
    return `mt-2 w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
      errors[fieldName]
        ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
        : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
    }`
  }

  return (
    <div
      aria-labelledby="create-assignment-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4"
      role="dialog"
    >
      <div className="my-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-blue-600">
          New assignment
        </p>
        <h2 id="create-assignment-title" className="mt-3 text-2xl font-bold text-slate-900">
          Create Assignment
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Add the assignment details students will use to complete their work.
        </p>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="assignment-title" className="text-sm font-semibold text-slate-800">
              Assignment title
            </label>
            <input
              id="assignment-title"
              name="title"
              type="text"
              value={values.title}
              onChange={handleChange}
              className={getFieldClassName('title')}
              aria-describedby={errors.title ? 'assignment-title-error' : undefined}
            />
            {errors.title && (
              <p id="assignment-title-error" className="mt-1 text-sm text-red-600">
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="assignment-description" className="text-sm font-semibold text-slate-800">
              Description
            </label>
            <textarea
              id="assignment-description"
              name="description"
              rows="4"
              value={values.description}
              onChange={handleChange}
              className={getFieldClassName('description')}
              aria-describedby={errors.description ? 'assignment-description-error' : undefined}
            />
            {errors.description && (
              <p id="assignment-description-error" className="mt-1 text-sm text-red-600">
                {errors.description}
              </p>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="assignment-due-date" className="text-sm font-semibold text-slate-800">
                Due date
              </label>
              <input
                id="assignment-due-date"
                name="dueDate"
                type="date"
                value={values.dueDate}
                onChange={handleChange}
                className={getFieldClassName('dueDate')}
                aria-describedby={errors.dueDate ? 'assignment-due-date-error' : undefined}
              />
              {errors.dueDate && (
                <p id="assignment-due-date-error" className="mt-1 text-sm text-red-600">
                  {errors.dueDate}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="assignment-drive-link" className="text-sm font-semibold text-slate-800">
                Drive/resource URL
              </label>
              <input
                id="assignment-drive-link"
                name="driveLink"
                type="url"
                placeholder="https://drive.google.com/..."
                value={values.driveLink}
                onChange={handleChange}
                className={getFieldClassName('driveLink')}
                aria-describedby={errors.driveLink ? 'assignment-drive-link-error' : undefined}
              />
              {errors.driveLink && (
                <p id="assignment-drive-link-error" className="mt-1 text-sm text-red-600">
                  {errors.driveLink}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="min-h-11 rounded-lg border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-11 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AssignmentForm