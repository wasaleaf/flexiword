export class Toast {
  public constructor(
    public message: string,
    public timeout: number | null = null,
    public closing: boolean = false
  ) {}
}