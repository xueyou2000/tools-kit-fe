import { Grid, Card, Heading, Link, Text, Flex, Avatar, Box } from '@radix-ui/themes'
import { Link as RouterLink } from 'react-router'
import { ArrowRightIcon } from '@radix-ui/react-icons'

import { toolsConfig } from '@/constants/tools-config'

import './index.scss'

export default function ToolsGallery() {
  return (
    <div className="tools-gallery-page">
      <Heading size="8" mb="6" className="page-title">
        ToolsKit 工具大全
      </Heading>
      <Box>
        {Object.entries(toolsConfig).map(([key, value]) => (
          <Card key={key} className="tools-gallery-card" size="4">
            <Heading as="h2" size="5" mb="3">
              {value.name}
            </Heading>
            <Grid columns="repeat(auto-fit, minmax(min(100%, 400px), 1fr))" gap="4" className="tools-list">
              {value.list.map((tool) => (
                <Link key={tool.name} asChild className="tool-link">
                  <RouterLink to={tool.url}>
                    <Card className="tool-item">
                      <Flex align="center" justify="between">
                        <Flex gap="2" align="center">
                          <Avatar size="2" src={tool.icon} fallback="🛠️" className="tool-icon" />
                          <Text size="2">{tool.name}</Text>
                        </Flex>
                        <ArrowRightIcon className="arrow-icon" />
                      </Flex>
                    </Card>
                  </RouterLink>
                </Link>
              ))}
            </Grid>
          </Card>
        ))}
      </Box>
    </div>
  )
}

export const element = <ToolsGallery />
