#!/bin/bash

SCRIPT_DIR=$(cd "$(dirname "$0")"; pwd)
echo $SCRIPT_DIR
TMPDIR=$SCRIPT_DIR"/.tmp.izbuild"
DESTDIR=$SCRIPT_DIR

VERSION="`awk '/version\>(.*)\</ { print $1 }' "./source/install.rdf"  | sed 's/<em:version\>\(.*\)\<\/em\:version\>.*/\1/'`"

if [ -d "$TMPDIR" ]
then
 rm -R "$TMPDIR"
fi

mkdir "$TMPDIR"

cp -R source/ "$TMPDIR"

cd "$TMPDIR/chrome/" && zip -r -q "$TMPDIR/imagezoom.jar" "./"

rm -R "$TMPDIR/chrome"

mkdir "$TMPDIR/chrome"

mv "$TMPDIR/imagezoom.jar" "$TMPDIR/chrome/"

XPINAME="imagezoom_${VERSION}.xpi"
XPIPATH="${DESTDIR}/${XPINAME}"
if [ -f "$XPIPATH" ]
then
 rm "$XPIPATH"
fi

cd "$TMPDIR/" && zip -r -D -q "${XPIPATH}" "./"

rm -R "$TMPDIR"

echo "XPI file written to \"${XPINAME}\""

