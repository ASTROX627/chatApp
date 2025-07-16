import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { X } from 'lucide-react'
import { Fragment, type FC } from 'react'


type ModalProps = {
  isOpen: boolean,
  onClose: () => void,
  src: string,
  alt: string
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, src, alt }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom='opacity-0'
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black opacity-75" />
        </TransitionChild>
        <button
          onClick={onClose}
          className="fixed ltr:left-2 rtl:right-2 top-2 cursor-pointer text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-2 z-50"
        >
          <X size={24} />
        </button>
        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel
                className="relative transform overflow-hidden rounded-lg bg-transparent shadow-xl transition-all max-w-7xl max-h-[90vh]"
              >
                <img
                  src={src}
                  alt={alt}
                  className="max-w-full max-h-full object-contain rounded-lg"
                  style={{
                    maxHeight: '90vh',
                    maxWidth: '90vw'
                  }}
                />
                {alt && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-70 px-4 py-2 rounded-lg text-sm">
                    <DialogTitle as='h3' className="text-sm font-medium">{alt}</DialogTitle>
                  </div>
                )}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default Modal
