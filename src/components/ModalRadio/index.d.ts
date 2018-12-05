import * as React from 'react'
import { deflate } from 'zlib';

interface ModalRadioProps {
  title?: string,
  label?: string,
  name?: string,
  reason?: string,
  visible: boolean,
  onCancel: () => void,
  onOk: () => void
}

export default class ModalRadio extends React.Component<ModalRadioProps, any> {}