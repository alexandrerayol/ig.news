'use client'
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

//Determinamos todos as propriedades que este componente irá receber
//E extendemos para que ela possa receber também todas as propriedades originais.

interface ActiveLinkProps extends LinkProps{
    activeClassName: string;
    fixedClassName? : string;
    children: ReactNode;
}

// {...rest} significa todas as propriedades originais do elemento.

export function ActiveLink({activeClassName, fixedClassName, children, ...rest}: ActiveLinkProps){
    const pathName = usePathname()
    return(
        <Link {...rest} className={`${fixedClassName} ${pathName === rest.href? activeClassName : ''}`}>
            {children}
        </Link>
    )
}