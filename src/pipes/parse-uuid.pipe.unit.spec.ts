import { describe, it, expect } from 'vitest';
import { ParseUUIDPipe } from './parse-uuid.pipe';
import { BadRequestException } from '@nestjs/common';
import * as C from '../constants';

describe('ParseUUIDPipe', () => {
    const pipe = new ParseUUIDPipe();

    it('should return the value if it is a valid UUID', () => {
        const uuid = '550e8400-e29b-41d4-a716-446655440000';
        expect(pipe.transform(uuid)).toBe(uuid);
    });

    it('should throw BadRequestException for invalid UUID', () => {
        expect(() => pipe.transform(C.NOT_UUID)).toThrow(BadRequestException);
        expect(() => pipe.transform(C.NOT_UUID)).toThrow(C.INVALID_UUID_FORMAt);
    });
});