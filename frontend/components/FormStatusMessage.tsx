export default function FormStatusMessage({
  status,
  successText,
  errorText,
}: {
  status: 'idle' | 'submitting' | 'success' | 'error';
  successText: string;
  errorText: string;
}) {
  if (status === 'success') {
    return (
      <p role="status" className="rounded-card bg-accent-green/10 px-4 py-3 text-sm font-medium text-accent-green">
        {successText}
      </p>
    );
  }
  if (status === 'error') {
    return (
      <p role="alert" className="rounded-card bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
        {errorText}
      </p>
    );
  }
  return null;
}
