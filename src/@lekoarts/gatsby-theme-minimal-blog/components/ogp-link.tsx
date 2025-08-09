import * as React from "react"

interface OgpData {
  title?: string
  description?: string
  image?: string
}

const fetchOgp = async (url: string): Promise<OgpData> => {
  try {
    const res = await fetch(`https://r.jina.ai/${url}`)
    const html = await res.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")
    const getMeta = (prop: string) =>
      doc.querySelector(`meta[property='${prop}']`)?.getAttribute("content") ||
      doc.querySelector(`meta[name='${prop}']`)?.getAttribute("content")

    return {
      title: getMeta("og:title") || doc.title,
      description: getMeta("og:description") || undefined,
      image: getMeta("og:image") || undefined,
    }
  } catch (e) {
    console.error(e)
    return {}
  }
}

const OgpLink: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = ({ href, children, ...rest }) => {
  const [ogp, setOgp] = React.useState<OgpData | null>(null)

  React.useEffect(() => {
    if (!href || !/^https?:/.test(href)) return
    fetchOgp(href).then(setOgp)
  }, [href])

  if (!href || !/^https?:/.test(href) || !ogp) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "block",
        border: "1px solid #ccc",
        borderRadius: "4px",
        textDecoration: "none",
        color: "inherit",
        maxWidth: "500px",
        margin: "1rem 0",
      }}
      {...rest}
    >
      {ogp.image && (
        <img
          src={ogp.image}
          alt={ogp.title || href}
          style={{ width: "100%", maxHeight: "260px", objectFit: "cover", borderRadius: "4px 4px 0 0" }}
        />
      )}
      <div style={{ padding: "8px" }}>
        <strong>{ogp.title || href}</strong>
        {ogp.description && <p style={{ margin: "4px 0 0" }}>{ogp.description}</p>}
      </div>
    </a>
  )
}

export default OgpLink
