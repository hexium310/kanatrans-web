import { ProblemDocument } from 'http-problem-details';
import type { ProblemDocumentOptions } from 'http-problem-details/dist/ProblemDocument';

import type { OutputStreamReadResult } from '@/types/output';

export const buildResponse = (output: OutputStreamReadResult, error: OutputStreamReadResult): Response => {
  if (error.value.byteLength > 0) {
    const message = new TextDecoder().decode(error.value);

    return responseFromProblemDetails({
      status: 500,
      detail: message,
    });
  }

  try {
    const wasiResponse = new TextDecoder().decode(output?.value).split('\n');
    const status = Number.parseInt(wasiResponse[0], 10);
    const body = JSON.parse(wasiResponse[1]);

    if (Object.hasOwn(body, 'status')) {
      return responseFromProblemDetails(body);
    }

    return Response.json(body, { status });
  } catch (e) {
    return responseFromProblemDetails({
      status: 500,
      detail: e instanceof SyntaxError ? e.message : 'Unexpected error',
    });
  }
};

const responseFromProblemDetails = (fields: ProblemDocumentOptions): Response => {
  const problemDocument = new ProblemDocument(fields);

  const status = problemDocument.status;
  const headers = new Headers();
  headers.append('Content-Type', 'application/problem+json');

  return Response.json(problemDocument, { status, headers });
};
