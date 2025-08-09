import * as React from "react"
import { Text } from "theme-ui"
import { preToCodeBlock } from "@lekoarts/themes-utils"
import Code from "@lekoarts/gatsby-theme-minimal-blog/src/components/code"
import Title from "@lekoarts/gatsby-theme-minimal-blog/src/components/title"
import OgpLink from "./ogp-link"

const MdxComponents = {
  Text: (props: any) => <Text {...props} />,
  Title: (props: any) => <Title {...props} />,
  a: ({ title, ...rest }: any) =>
    title === "ogp" ? <OgpLink {...rest} /> : <a title={title} {...rest} />,
  pre: (preProps: any) => {
    const props = preToCodeBlock(preProps)
    if (props) {
      return <Code {...props} />
    }
    return <pre {...preProps} />
  },
}

export default MdxComponents
