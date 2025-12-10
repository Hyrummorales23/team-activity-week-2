import { Suspense } from 'react';
import EditProductClient from './editProductClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditProductClient />
    </Suspense>
  );
}