import { Spinner as ChakraSpinner, SpinnerProps } from "@chakra-ui/react";

interface Props extends SpinnerProps {}

export const Spinner = (props: Props) => {
  // Props
  const { ...restProps } = props;

  // TODO buat 3 dots spinner, apply global, like in btn
  // TODO cek mobile

  return <ChakraSpinner aspectRatio={1} {...restProps} />;
};
