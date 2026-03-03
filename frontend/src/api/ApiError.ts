export default class ApiError extends Error {
  readonly status: number;
  readonly data: any;
  
  constructor(
    status: number,
    message: string,
    data?: any
  ) {
    super(message);

    this.name = 'ApiError';
    this.status = status;
    this.data = data;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
};
