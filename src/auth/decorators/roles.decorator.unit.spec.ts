import { describe, it, expect, vi } from 'vitest';
import { Roles } from './roles.decorator';
import { SetMetadata } from '@nestjs/common';
import { ADMIN, EDITOR } from '../../constants';

vi.mock('@nestjs/common', () => ({
  SetMetadata: vi.fn(),
}));

describe('Roles decorator (unit)', () => {
  it('should call SetMetadata with roles', () => {
    Roles(ADMIN, EDITOR);

    expect(SetMetadata).toHaveBeenCalledWith('roles', [ADMIN, EDITOR]);
  });
});
