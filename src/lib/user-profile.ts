export function getUserDisplayName(user: any): string {
	return user?.name || user?.nickname || user?.email || "User";
}

export function getUserAvatarUrl(user: any): string | undefined {
	const candidates = [
		user?.image,
		user?.pictureUrl,
		user?.picture,
		user?.profilePictureUrl,
		user?.avatarUrl,
		user?.avatar_url,
	];

	for (const candidate of candidates) {
		if (typeof candidate === "string" && candidate.trim().length > 0) {
			return candidate;
		}
	}

	return undefined;
}
