from conoha import ConoHa, Region


def main():
    cono = ConoHa(region=Region.TYO1, username='gncu66234075', password='RGM-79NFb', tenant_id='e8df823792164992a808a95e7112c097')

    #print('token:  ' + cono.token)
    #print('tenant: ' + cono.tenant)

    #print('flavors: ')
    #print(cono.flavors)

    #print('images: ')
    #print(cono.images)

    #print('security_groups')
    #print(cono.security_groups)

    cono.create(
        image_name='vmi-debian-9.0-amd64-unified',
        flavor_name='g-1gb',
        admin_pass='RGM-79NFb',
        tag_name='DebianTest',
        sec_list=['gncs-ipv6-all', 'default', 'gncs-ipv4-all'],
    )


if __name__ == '__main__':
    main()
