import { Request, Response } from 'express';
import { InjectionToken } from "@angular/core";

export const REQUEST = new InjectionToken<Request>('REQUEST');
export const RESPONSE = new InjectionToken<Response>('RESPONSE');
