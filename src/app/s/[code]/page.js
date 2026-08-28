import SharedLinkTracker from "../../../components/SharedLinkTracker";

export default async function SharedPage({ params }) {
    const { code } = await params;

    if (!code) return null;

    return (
        <SharedLinkTracker code={code} />
    )
}