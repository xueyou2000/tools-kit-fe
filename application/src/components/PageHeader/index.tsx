import { useNavigate } from 'react-router'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { Flex, IconButton, Text } from '@radix-ui/themes'
import './index.scss'

interface PageHeaderProps {
  title: string
}

export default function PageHeader({ title }: PageHeaderProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <Flex className='page-header' align='center' gap='2'>
      <IconButton size='2' variant='ghost' onClick={handleBack} className='page-header-back'>
        <ArrowLeftIcon width={20} height={20} />
      </IconButton>
      <Text size='3' weight='medium'>
        {title}
      </Text>
    </Flex>
  )
}
