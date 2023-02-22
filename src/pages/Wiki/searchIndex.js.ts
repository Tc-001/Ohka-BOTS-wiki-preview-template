import Fuse from "fuse.js"
import { MarkdownInstance } from "astro"
import c from "lz-string"
import fs from "node:fs"
import {marked} from "marked"

export interface Pagelist {
	params: {
		page: string
	}
	props: {
		title: string
		Content: any
		justText: string
		allPagePaths: string[]
		gitPath: string
	}
}

export async function getAllArticles(): Promise<Pagelist[]> {
	const wikiFiles = import.meta.glob("../../../Wiki/**/!(WIP)*.mdx") as unknown as Record<string, () => Promise<MarkdownInstance<{}>>>;

	let wikiPages: Pagelist[] = []

	for (const pagePath in wikiFiles) {
		const page = await wikiFiles[pagePath]()
		wikiPages.push({
			props: {
				title: pagePath.replace(/.+\/Wiki\/(.+)\.mdx/, "$1").replace(/.+\d+-(.+)/, "$1").replace(/_/g, " "),
				justText: marked(
										fs.readFileSync(page.file, "utf-8")
										.replace(/\{\/\*(.|\n)+\*\/\}/g, " ")
										.replace(/^---[^-]+---/, "")
										.replace(/\nimport.+/g, " ")
										.replace(/[^\S\r\n]/g, " ")
									)
								.replace(/<(.|\n)*?>/g, " "),
				Content: page.Content,
				gitPath: pagePath.replace(/.+\/Wiki\/(.+)\.mdx/, "$1"),
				allPagePaths: [],
			},
			params: {
				page: pagePath.replace(/.+\/Wiki\/(.+)\.mdx/, "$1").replace(/.+\d+-(.+)/, "$1")
			}
		})
	}

	wikiPages = wikiPages.sort((a, b) => {
		if (a.params.page.includes("/")) return 999;
		if (b.params.page.includes("/")) return -999;
		return (
			parseInt(a.params.page.split("/").at(-1).replace(/.+(\d+)-.+\.mdx/, "$1")) -
			parseInt(a.params.page.split("/").at(-1).replace(/.+(\d+)-.+\.mdx/, "$1"))
		);
	});

	const paths = wikiPages.map(y => y.params.page)
	wikiPages = wikiPages.map(x => { x.props.allPagePaths = paths; return x })

	return wikiPages

}

export async function get() {
	// Generate index

	const articles = (await getAllArticles()).map(x => ({ props: { title: x.props.title, justText: x.props.justText }, params: x.params }))

	const index = Fuse.createIndex(
		["props.justText", "props.title"],
		articles
	)

	console.log(articles);
	

	return {
		body: c.compressToUTF16(JSON.stringify([articles, index]))
	};
}