import { FormEvent, useEffect, useState } from 'react';

import Button from '../../ui/Button';
// import FileInput from '../../ui/FileInput';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';

import { useUser } from './useUser';
import Spinner from '../../ui/Spinner';
import { useUpdateUser } from './useUpdateUser';

function UpdateUserDataForm() {
  const { user, isLoading } = useUser();
  const [fullName, setFullName] = useState<string>('');
  const { updateUser, isUpdating } = useUpdateUser();

  useEffect(() => {
    if (user) {
      setFullName(user.userName || '');
    }
  }, [user]);

  if (isLoading || isUpdating) {
    return <Spinner />;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!fullName) return;
    updateUser({ fullName });
  }

  function handleCancel() {
    setFullName('');
  }
  if (!user) {
    return <div>No User found.</div>;
  }

  const email = user?.email || '';

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow label="Email address">
        <Input value={email} disabled />
      </FormRow>
      <FormRow label="Full name">
        <Input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          id="fullName"
        />
      </FormRow>

      <FormRow>
        <Button type="reset" variation="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button>Update account</Button>
      </FormRow>
    </Form>
  );
}

export default UpdateUserDataForm;
