type BlancLogoProps = {
  className?: string
  size?: number
}

/** Official BlancVPN mark (rounded blue square with white B). */
export function BlancLogo({ className, size = 40 }: BlancLogoProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 39 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect width="39" height="38" rx="11" fill="#3183ff" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.02782 19.3169C9.05463 20.1392 9.83268 20.7018 10.5785 20.4381L28.189 14.2121C29.0817 13.8965 29.7076 13.0542 29.779 12.0723L29.9079 10.3027C29.9857 9.2337 29.1765 8.32139 28.1506 8.32139H11.1007C9.77166 8.32139 8.70713 9.47237 8.75237 10.8605L9.02782 19.3169ZM9.13297 23.2878C9.13297 22.7528 9.46533 22.2795 9.9543 22.1183L21.6985 18.2453C22.3848 18.019 23.1212 18.0171 23.8085 18.24L28.5009 19.7617C29.4952 20.0842 30.1679 21.0505 30.1541 22.1369L30.1152 25.1713C30.1035 26.0934 29.5971 26.9308 28.8043 27.3386L21.2268 31.2376C20.5882 31.5661 19.8414 31.5752 19.1958 31.2622L10.1533 26.8786C9.531 26.5768 9.13297 25.9259 9.13297 25.2101V23.2878Z"
        fill="#ffffff"
      />
    </svg>
  )
}
