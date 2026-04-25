import { describe, it, expect } from 'vitest';
import { validate } from 'class-validator';
import { UpdateUserDto } from './update-user.dto';
import * as TEST_UTIL from '../../test-utils';

describe('UpdateUserDto (validation)', () => {
  const make = (data: Partial<UpdateUserDto>) =>
    Object.assign(new UpdateUserDto(), data);
  const oldPassword = TEST_UTIL.TEST_OLD_PASS;
  const newPassword = TEST_UTIL.TEST_NEW_PASS;

  it('should fail when required fields missing', async () => {
    const dto = make({ newPassword });

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when oldPassword is empty string', async () => {
    const dto = make({ oldPassword: '', newPassword });

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when newPassword is empty string', async () => {
    const dto = make({ oldPassword, newPassword: '' });

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when oldPassword is not a string', async () => {
    const dto = make({ oldPassword: 123 as any, newPassword });

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when newPassword is not a string', async () => {
    const dto = make({ oldPassword, newPassword: 123 as any });

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
  });

  it('should pass with valid payload', async () => {
    const dto = make({
      oldPassword,
      newPassword,
    });

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });
});
