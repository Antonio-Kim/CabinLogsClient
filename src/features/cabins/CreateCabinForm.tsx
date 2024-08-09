// import styled from 'styled-components';
import { useForm } from 'react-hook-form';

import Input from '../../ui/Input';
import Button from '../../ui/Button';
import Textarea from '../../ui/Textarea';
import FileInput from '../../ui/FileInput';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import { useCreateCabin } from './useCreateCabin';
import { ReactNode } from 'react';

type FormData = {
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  description: string;
  image?: FileList;
};

type CreateCabinFormType = {
  children?: ReactNode;
  onCloseModal?: () => void;
};

function CreateCabinForm({ onCloseModal }: CreateCabinFormType) {
  const { register, handleSubmit, reset, getValues, formState } = useForm<FormData>();
  const { errors } = formState;
  const { isCreating, createCabin } = useCreateCabin();

  function onSubmit(data: FormData) {
    console.log('Form data:', data);
    const fileList = getValues('image') as FileList;
    console.log('FileList: ', fileList);

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('maxCapacity', data.maxCapacity.toString());
    formData.append('regularPrice', data.regularPrice.toString());
    formData.append('discount', data.discount.toString());
    formData.append('description', data.description);

    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      console.log('First file', file);
      formData.append('image', file);
    }

    createCabin(formData, {
      onSuccess: () => {
        reset();
        onCloseModal?.();
      },
    });
  }

  return (
    <Form type={onCloseModal ? 'modal' : 'regular'} onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="Cabin name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isCreating}
          {...register('name', { required: 'This field is required' })}
        />
      </FormRow>

      <FormRow label="Maxmium capacity" error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          disabled={isCreating}
          {...register('maxCapacity', {
            required: 'This field is required',
            min: { value: 1, message: 'Capacity should be at least 1' },
          })}
        />
      </FormRow>

      <FormRow label="Regular price" error={errors?.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          disabled={isCreating}
          {...register('regularPrice', {
            required: 'This field is required',
            min: { value: 1, message: 'Capacity should be at least 1' },
          })}
        />
      </FormRow>

      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          disabled={isCreating}
          defaultValue={0}
          {...register('discount', {
            required: 'This field is required',
            validate: (value) =>
              value <= getValues().regularPrice ||
              'Discount price has to be less than regular price',
          })}
        />
      </FormRow>

      <FormRow label="Description for website" error={errors?.description?.message}>
        <Textarea
          id="description"
          disabled={isCreating}
          defaultValue=""
          {...register('description', { required: 'This field is required' })}
        />
      </FormRow>

      <FormRow label="Cabin photo" error={errors?.image?.message}>
        <FileInput
          id="image"
          accept="image/*"
          {...register('image', { required: 'This field is required' })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation="secondary" type="reset" onClick={() => onCloseModal?.()}>
          Cancel
        </Button>
        <Button disabled={isCreating}>Add cabin</Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
